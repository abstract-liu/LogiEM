import zh from '@pkgs/locales/zh';
import { systemKey } from '../constants/menu';

export const permissions = {
  [`menu.${systemKey}.cluster.physics.detail`]: true,
  [`menu.${systemKey}.cluster.logic.detail`]: true,
  [`menu.${systemKey}.index.logic.detail`]: true,
  [`menu.${systemKey}.index.physics.detail`]: true,
  [`menu.${systemKey}.index.modify`]: true,
  [`menu.${systemKey}.index.modify.mapping`]: true,
  [`menu.${systemKey}.work-order.my-application.detail`]: true,
  [`menu.${systemKey}.work-order.my-approval.detail`]: true,
  [`menu.${systemKey}.scheduling.log.detail`]: true,
  [`menu.${systemKey}.index-admin.detail`]: true
}

export default {
  ...zh,
  [`menu`]: '物理集群',
  [`menu.${systemKey}`]: '物理集群',
  [`menu.${systemKey}.cluster`]: '集群管理',
  [`menu.${systemKey}.cluster.physics`]: '物理集群',
  [`menu.${systemKey}.cluster.logic`]: '逻辑集群',
  [`menu.${systemKey}.cluster.physics.detail`]: '物理集群详情',
  [`menu.${systemKey}.cluster.logic.detail`]: '逻辑集群详情',
  [`menu.${systemKey}.cluster.edition`]: '集群版本',
  [`menu.${systemKey}.index`]: '索引管理',
  [`menu.${systemKey}.index.logic`]: '逻辑模板',
  [`menu.${systemKey}.index.logic.detail`]: '索引模版详情',
  [`menu.${systemKey}.index.physics`]: '物理模板',
  [`menu.${systemKey}.index.physics.detail`]: '物理模版详情',
  [`menu.${systemKey}.index.modify`]: '编辑模版',
  [`menu.${systemKey}.index.create`]: '新建模板',
  [`menu.${systemKey}.index.clear`]: '索引清理',
  [`menu.${systemKey}.index.modify.mapping`]: '编辑mapping',
  [`menu.${systemKey}.indicators`]: '指标看板',
  [`menu.${systemKey}.indicators.cluster`]: '集群看板',
  [`menu.${systemKey}.indicators.gateway`]: '网关看板',
  [`menu.${systemKey}.system`]: '系统管理',
  [`menu.${systemKey}.system.config`]: '平台配置',
  [`menu.${systemKey}.system.operation`]: '操作记录',
  // [`menu.${systemKey}.user`]: '用户管理',
  [`menu.${systemKey}.user.users`]: '用户',
  [`menu.${systemKey}.user.project`]: '项目',
  [`menu.${systemKey}.user.role`]: '角色',
  [`menu.${systemKey}.work-order`]: '工单任务',
  [`menu.${systemKey}.work-order.my-application`]: '我的申请',
  [`menu.${systemKey}.work-order.my-application.detail`]: '我的申请详情',
  [`menu.${systemKey}.work-order.my-approval`]: '我的审批',
  [`menu.${systemKey}.work-order.my-approval.detail`]: '我的审批详情',
  [`menu.${systemKey}.work-order.task`]: '任务列表',
  [`menu.${systemKey}.work-order.task.detail`]: '我的任务列表详情',
  [`menu.${systemKey}.scheduling`]: '调度任务',
  [`menu.${systemKey}.scheduling.task`]: '任务列表',
  [`menu.${systemKey}.scheduling.log`]: '调度日志',
  [`menu.${systemKey}.scheduling.log.detail`]: '调度日志详情',
  [`menu.${systemKey}.search-query`]: '检索查询',
  [`menu.${systemKey}.search-query.dsl-tpl`]: 'DSL模板',
  [`menu.${systemKey}.search-query.index-search`]: '索引查询',
  [`menu.${systemKey}.index-admin`]: '索引管理',
  [`menu.${systemKey}.index-admin.detail`]: '索引管理详情',
  [`menu.${systemKey}.index-tpl-management`]: '模板管理',
};