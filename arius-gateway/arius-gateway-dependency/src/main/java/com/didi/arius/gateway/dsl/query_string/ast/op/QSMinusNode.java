package com.didi.arius.gateway.dsl.query_string.ast.op;

import com.didi.arius.gateway.dsl.query_string.ast.op.common.QSSingleOpNode;
import com.didi.arius.gateway.dsl.query_string.visitor.QSVisitor;

public class QSMinusNode extends QSSingleOpNode {
    public QSMinusNode(String source) {
        super(source);
    }

    @Override
    public void accept(QSVisitor vistor) {
        vistor.visit(this);
    }
}