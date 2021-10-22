package com.didi.arius.gateway.dsl.dsl.ast.query;

import com.didi.arius.gateway.dsl.dsl.ast.common.KeyWord;
import com.didi.arius.gateway.dsl.dsl.ast.common.multi.NodeMap;
import com.didi.arius.gateway.dsl.dsl.visitor.basic.Visitor;

public class Queryquery extends KeyWord {
    public NodeMap m = new NodeMap();

    public Queryquery(String name) {
        super(name);
    }

    @Override
    public void accept(Visitor vistor) {
        vistor.visit(this);
    }
}